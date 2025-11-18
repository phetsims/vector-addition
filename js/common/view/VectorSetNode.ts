// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorSetNode is responsible for creating the view for all vectors associated with a VectorSet.
 *
 * Responsibilities include:
 * - creating the Nodes for the resultant vector and its component vectors
 * - creating and managing Nodes for registered vectors
 * - handling layering of all Nodes related to vectors in the VectorSet
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import BaseVector from '../model/BaseVector.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import Vector from '../model/Vector.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorSet from '../model/VectorSet.js';
import BaseVectorNode from './BaseVectorNode.js';
import ComponentVectorNode from './ComponentVectorNode.js';
import ResultantComponentVectorNode from './ResultantComponentVectorNode.js';
import ResultantVectorNode from './ResultantVectorNode.js';
import VectorNode from './VectorNode.js';
import VectorToolboxSlot from './VectorToolboxSlot.js';

export default class VectorSetNode extends Node {

  // The associated vector set
  public readonly vectorSet: VectorSet;

  // Non-resultant VectorNode for active vectors
  private readonly vectorNodes: VectorNode[];

  // Node for the vector set's resultant vector.
  private readonly resultantVectorNode: ResultantVectorNode;

  // Nodes for base vectors.  Note that the order of this array determines pdomOrder of vectors in the view.
  private readonly baseVectorNodes: BaseVectorNode[];

  // Transform between model and view coordinates.
  private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;

  // Vector that is currently selected on the graph, null means no vector is selected.
  private readonly selectedVectorProperty: Property<Vector | null>;

  // Whether the magnitude is visible in the vector's label.
  private readonly valuesVisibleProperty: TReadOnlyProperty<boolean>;

  // Whether the angle is visible.
  private readonly anglesVisibleProperty: TReadOnlyProperty<boolean>;

  // The bound of the graph - it's x-axis range and y-axis range.
  private readonly graphBoundsProperty: TReadOnlyProperty<Bounds2>;

  // Style for drawing component vectors.
  private readonly componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>;

  // Focus moves here when all vectors have been removed from this VectorSetNode.
  private vectorToolboxSlot: Node | null;

  public constructor( vectorSet: VectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      resultantVectorVisibleProperty: TReadOnlyProperty<boolean>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      tandem: Tandem ) {

    const resultantVector = vectorSet.resultantVector;

    // Every VectorSet has a resultant vector and resultant component vectors, so create them.
    const resultantVectorNode = new ResultantVectorNode( resultantVector, modelViewTransformProperty,
      selectedVectorProperty, valuesVisibleProperty, anglesVisibleProperty, graphBoundsProperty,
      resultantVectorVisibleProperty );

    const xResultantComponentVectorNode = new ResultantComponentVectorNode(
      resultantVector.xComponentVector,
      resultantVector,
      modelViewTransformProperty,
      selectedVectorProperty,
      componentVectorStyleProperty,
      valuesVisibleProperty,
      resultantVectorVisibleProperty );

    const yResultantComponentVectorNode = new ResultantComponentVectorNode(
      resultantVector.yComponentVector,
      resultantVector,
      modelViewTransformProperty,
      selectedVectorProperty,
      componentVectorStyleProperty,
      valuesVisibleProperty,
      resultantVectorVisibleProperty );

    super( {
      isDisposable: false,
      children: [ xResultantComponentVectorNode, yResultantComponentVectorNode, resultantVectorNode ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    this.vectorSet = vectorSet;
    this.vectorNodes = [];
    this.resultantVectorNode = resultantVectorNode;
    this.baseVectorNodes = [];
    this.vectorToolboxSlot = null;

    this.modelViewTransformProperty = modelViewTransformProperty;
    this.selectedVectorProperty = selectedVectorProperty;
    this.valuesVisibleProperty = valuesVisibleProperty;
    this.anglesVisibleProperty = anglesVisibleProperty;
    this.graphBoundsProperty = graphBoundsProperty;
    this.componentVectorStyleProperty = componentVectorStyleProperty;

    // When the resultant vector becomes selected, move it and its component vectors to the front.
    selectedVectorProperty.link( selectedVector => {
      if ( selectedVector === resultantVectorNode.vector ) {

        // move all vectors in the set to the front, see https://github.com/phetsims/vector-addition/issues/94
        this.moveToFront();

        // order is important - resultant vector should be in front of its components
        xResultantComponentVectorNode.moveToFront();
        yResultantComponentVectorNode.moveToFront();
        resultantVectorNode.moveToFront();
      }
    } );

    // Context response when a vector is added to or removed from the graph area.
    this.vectorSet.allVectors.forEach( vector => {
      vector.isOnGraphProperty.lazyLink( isOnGraph => {
        if ( isOnGraph ) {
          this.addAccessibleContextResponse( StringUtils.fillIn( VectorAdditionStrings.a11y.vectorAddedToGraphAreaStringProperty, {
            symbol: vector.accessibleSymbolProperty.value
          } ) );
        }
        else {
          this.addAccessibleContextResponse( StringUtils.fillIn( VectorAdditionStrings.a11y.vectorRemovedFromGraphAreaStringProperty, {
            symbol: vector.accessibleSymbolProperty.value
          } ) );
        }
      } );
    } );

    this.addLinkedElement( vectorSet );

    // After PhET-iO state has been restored, register all active vectors to build their view.
    if ( Tandem.PHET_IO_ENABLED ) {
      phetioStateSetEmitter.addListener( () => {
        vectorSet.activeVectors.forEach( activeVector => this.registerVector( activeVector ) );
      } );
    }
  }

  /**
   * Registers a Vector by creating its associated VectorNode and the ComponentVectorNodes.
   * The Nodes are deleted if Vector is ever removed from its VectorSet.
   * @param vector - the vector model
   * @param [forwardingEvent] - if provided, it will forward this event to the Vector body drag listener. This is used
   *   to forward the click event from the VectorToolbox to the VectorNode. If not provided, no event is forwarded.
   */
  public registerVector( vector: Vector, forwardingEvent?: PressListenerEvent ): void {

    // Create the view for the vector and its component vectors
    const vectorNode = new VectorNode( vector, this.modelViewTransformProperty, this.selectedVectorProperty,
      this.valuesVisibleProperty, this.anglesVisibleProperty, this.graphBoundsProperty );

    // Add to this.vectorNodes, and sort in the same order as vectorSet.allVectors.
    this.vectorNodes.push( vectorNode );

    // Insert vectorNode into the pdomOrder at the correct position.
    this.updatePDOMOrder();

    const xComponentVectorNode = new ComponentVectorNode( vector.xComponentVector,
      this.modelViewTransformProperty,
      this.selectedVectorProperty,
      this.componentVectorStyleProperty,
      this.valuesVisibleProperty );

    const yComponentVectorNode = new ComponentVectorNode( vector.yComponentVector,
      this.modelViewTransformProperty,
      this.selectedVectorProperty,
      this.componentVectorStyleProperty,
      this.valuesVisibleProperty );

    // To keep vector in front of its components when we move the selected vector to the front.
    const vectorAndComponentsNode = new Node( {
      children: [ xComponentVectorNode, yComponentVectorNode, vectorNode ]
    } );

    this.addChild( vectorAndComponentsNode );

    // Optional event forwarding
    if ( forwardingEvent ) {
      vectorNode.forwardEvent( forwardingEvent );
    }

    // Move focus to the new vectorNode.
    vectorNode.focus();

    // When the vector becomes selected, move it and its components to the front.
    // unlink is required when the vector is removed.
    const selectedVectorListener = ( selectedVector: Vector | null ) => {
      if ( selectedVector === vectorNode.vector ) {

        // Move all vectors in the set to the front, see https://github.com/phetsims/vector-addition/issues/94
        this.moveToFront();

        // Move the selected vector and its components to the front.
        vectorAndComponentsNode.moveToFront();
      }
    };
    this.selectedVectorProperty.link( selectedVectorListener );

    if ( vector.isRemovableFromGraph ) {

      // Clean up when the vector is removed from the graph.
      const vectorRemovedListener = ( removedVector: Vector ) => {

        if ( removedVector === vector ) {

          // Remove vectorNode from this.vectorNodes.
          const index = this.vectorNodes.indexOf( vectorNode );
          affirm( index !== -1, 'VectorNode not found in this.vectorNodes' );
          this.vectorNodes.splice( index, 1 );

          // Update the pdomOrder to remove the deleted vectorNode.
          this.updatePDOMOrder();

          // Moves focus to another vector or back to the toolbox slot if there are no more vectors.
          this.moveFocus();

          // dispose the Nodes that were created when vector was registered.
          // Do this AFTER updating the pdomOrder, or there will be trouble.
          xComponentVectorNode.dispose();
          yComponentVectorNode.dispose();
          vectorNode.dispose();

          // remove listeners
          this.vectorSet.activeVectors.removeItemRemovedListener( vectorRemovedListener );
          this.selectedVectorProperty.unlink( selectedVectorListener );
        }
      };
      this.vectorSet.activeVectors.addItemRemovedListener( vectorRemovedListener );
    }
  }

  /**
   * Adds a base vector to the VectorSetNode.  Base vectors are never removed.
   * Base vectors do not have component vectors, see https://github.com/phetsims/vector-addition/issues/158
   */
  public addBaseVectorNode( baseVector: BaseVector,
                            baseVectorsVisibleProperty: TReadOnlyProperty<boolean>,
                            vectorColorPalette: VectorColorPalette ): void {

    // Node for the base vector
    const baseVectorNode = new BaseVectorNode( baseVector, vectorColorPalette, this.modelViewTransformProperty,
      this.selectedVectorProperty, this.valuesVisibleProperty, this.anglesVisibleProperty, this.graphBoundsProperty, {
        visibleProperty: baseVectorsVisibleProperty,
        tandem: this.tandem.createTandem( `${baseVector.tandemNameSymbol}BaseVectorNode` )
      } );
    this.addChild( baseVectorNode );
    this.baseVectorNodes.push( baseVectorNode );

    // Insert baseVectorNode into the pdomOrder at the correct position.
    this.updatePDOMOrder();

    // When the base vector becomes selected, move it (and the entire vector set) to the front.
    // unlink is unnecessary because VectorSetNode exists for the lifetime of the sim.
    this.selectedVectorProperty.link( selectedVector => {
      if ( selectedVector === baseVectorNode.vector ) {

        // move all vectors in the set to the front, see https://github.com/phetsims/vector-addition/issues/94
        this.moveToFront();

        // move the base vector to the front
        baseVectorNode.moveToFront();
      }
    } );
  }

  /**
   * Updates the focus order for interactive Nodes in this VectorSetNode. We need to explicitly set the focus order
   * because a vector selected with the pointer is moved to the front, which changes the implicit focus order.
   * See https://github.com/phetsims/vector-addition/issues/338.
   */
  private updatePDOMOrder(): void {

    // Sort the VectorNodes in the same order as vectorSet.allVectors.
    const sortedVectorNodes = _.sortBy( this.vectorNodes, vectorNode => this.vectorSet.allVectors.indexOf( vectorNode.vector ) );

    this.pdomOrder = [ ...sortedVectorNodes, this.resultantVectorNode, ...this.baseVectorNodes ];
  }

  /**
   * Sets the vector toolbox slot that this vector set is associate with.
   */
  public setVectorToolboxSlot( vectorToolboxSlot: VectorToolboxSlot ): void {
    affirm( this.vectorToolboxSlot === null, 'vectorToolboxSlot already set' );
    this.vectorToolboxSlot = vectorToolboxSlot;
  }

  /**
   * Moves focus to the first element in the pdomOrder for the VectorSet.
   * If the pdomOrder is empty, move focus to the toolbox slot that the vector was in.
   */
  private moveFocus(): void {
    affirm( this.vectorToolboxSlot !== null, 'vectorToolboxSlot is required for moveFocus.' );

    // Find the next VectorNode in the pdomOrder. This is complicated, so each condition is explained.
    const nextVectorNode = _.find( this.pdomOrder, element =>
      // pdomOrder may have contain null elements.
      ( element !== null ) &&
      // pdomOrder may have invisible elements.
      element.visible &&
      // pdomOrder may have non-focusable elements, like a VectorNode that is animating to the toolbox.
      element.focusable &&
      // ResultantVectorNode is a subclass of VectorNode, but it is not defined if there are no other vectors on the graph.
      !( element instanceof ResultantVectorNode )
    );

    if ( nextVectorNode ) {
      nextVectorNode.focus();
    }
    else {
      // Ensure that the toolbox slot is focusable before moving focus to it.
      // This is a workaround for https://github.com/phetsims/vector-addition/issues/387.
      this.vectorToolboxSlot.pdomVisible = true;
      this.vectorToolboxSlot.focus();
    }
  }
}

vectorAddition.register( 'VectorSetNode', VectorSetNode );