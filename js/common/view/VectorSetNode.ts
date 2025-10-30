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

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector from '../model/BaseVector.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import Vector from '../model/Vector.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorSet from '../model/VectorSet.js';
import ComponentVectorNode from './ComponentVectorNode.js';
import ResultantComponentVectorNode from './ResultantComponentVectorNode.js';
import ResultantVectorNode from './ResultantVectorNode.js';
import VectorNode from './VectorNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BaseVectorNode from './BaseVectorNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class VectorSetNode extends Node {

  public readonly vectorSet: VectorSet<Vector>;
  private readonly vectorNodes: VectorNode[]; // non-resultant VectorNodes
  private readonly resultantVectorNode: ResultantVectorNode;

  // Nodes for base vectors.  Note that the order of this array determines pdomOrder of vectors in the view.
  private readonly baseVectorNodes: BaseVectorNode[];

  private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;
  private readonly selectedVectorProperty: Property<Vector | null>;
  private readonly valuesVisibleProperty: TReadOnlyProperty<boolean>;
  private readonly anglesVisibleProperty: TReadOnlyProperty<boolean>;
  private readonly graphBoundsProperty: TReadOnlyProperty<Bounds2>;
  private readonly componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>;

  public constructor( vectorSet: VectorSet<Vector>,
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
      modelViewTransformProperty,
      selectedVectorProperty,
      componentVectorStyleProperty,
      valuesVisibleProperty,
      resultantVectorVisibleProperty );

    const yResultantComponentVectorNode = new ResultantComponentVectorNode(
      resultantVector.yComponentVector,
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

          //TODO https://github.com/phetsims/vector-addition/issues/290 Move focus to another VectorNode or back to toolbox slot.

          this.updatePDOMOrder();

          // dispose the Nodes that were created
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
}

vectorAddition.register( 'VectorSetNode', VectorSetNode );