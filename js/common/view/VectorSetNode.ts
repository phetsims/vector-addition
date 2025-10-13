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
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import Vector from '../model/Vector.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorSet from '../model/VectorSet.js';
import ComponentVectorNode from './ComponentVectorNode.js';
import ResultantComponentVectorNode from './ResultantComponentVectorNode.js';
import ResultantVectorNode from './ResultantVectorNode.js';
import VectorNode from './VectorNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BaseVectorNode from './BaseVectorNode.js';

export default class VectorSetNode extends Node {

  public readonly vectorSet: VectorSet;

  private readonly scene: VectorAdditionScene;
  private readonly valuesVisibleProperty: TReadOnlyProperty<boolean>;
  private readonly anglesVisibleProperty: TReadOnlyProperty<boolean>;
  private readonly componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>;

  public constructor( scene: VectorAdditionScene,
                      vectorSet: VectorSet,
                      resultantVectorVisibleProperty: TReadOnlyProperty<boolean>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      tandem: Tandem ) {

    const resultantVector = vectorSet.resultantVector;

    // Every VectorSet has a resultant vector and resultant component vectors, so create them.
    const resultantVectorNode = new ResultantVectorNode( resultantVector, scene, valuesVisibleProperty, anglesVisibleProperty, resultantVectorVisibleProperty, {
      tandem: tandem.createTandem( `${resultantVector.tandemNameSymbol}VectorNode` )
    } );
    const xResultantComponentVectorNode = new ResultantComponentVectorNode( resultantVector.xComponentVector, scene,
      componentVectorStyleProperty, valuesVisibleProperty, resultantVectorVisibleProperty );
    const yResultantComponentVectorNode = new ResultantComponentVectorNode( resultantVector.yComponentVector, scene,
      componentVectorStyleProperty, valuesVisibleProperty, resultantVectorVisibleProperty );

    super( {
      isDisposable: false,
      children: [ xResultantComponentVectorNode, yResultantComponentVectorNode, resultantVectorNode ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    this.vectorSet = vectorSet;

    this.scene = scene;
    this.valuesVisibleProperty = valuesVisibleProperty;
    this.anglesVisibleProperty = anglesVisibleProperty;
    this.componentVectorStyleProperty = componentVectorStyleProperty;

    // When the resultant vector becomes selected, move it and its component vectors to the front.
    scene.selectedVectorProperty.link( selectedVector => {
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
    const vectorNode = new VectorNode( vector, this.scene, this.valuesVisibleProperty, this.anglesVisibleProperty );

    const xComponentVectorNode = new ComponentVectorNode( vector.xComponentVector,
      this.scene,
      this.componentVectorStyleProperty,
      this.valuesVisibleProperty );

    const yComponentVectorNode = new ComponentVectorNode( vector.yComponentVector,
      this.scene,
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
    this.scene.selectedVectorProperty.link( selectedVectorListener );

    if ( vector.isRemovableFromGraph ) {

      // Clean up when the vector is removed from the graph.
      const vectorRemovedListener = ( removedVector: Vector ) => {

        if ( removedVector === vector ) {

          // dispose the Nodes that were created
          xComponentVectorNode.dispose();
          yComponentVectorNode.dispose();
          vectorNode.dispose();

          // remove listeners
          this.vectorSet.activeVectors.removeItemRemovedListener( vectorRemovedListener );
          this.scene.selectedVectorProperty.unlink( selectedVectorListener );
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
    const baseVectorNode = new BaseVectorNode( baseVector, vectorColorPalette, this.scene, this.valuesVisibleProperty,
      this.anglesVisibleProperty, {
        visibleProperty: baseVectorsVisibleProperty,
        tandem: this.tandem.createTandem( `${baseVector.tandemNameSymbol}BaseVectorNode` )
      } );
    this.addChild( baseVectorNode );

    // When the base vector becomes selected, move it (and the entire vector set) to the front.
    // unlink is unnecessary because VectorSetNode exists for the lifetime of the sim.
    this.scene.selectedVectorProperty.link( selectedVector => {
      if ( selectedVector === baseVectorNode.vector ) {

        // move all vectors in the set to the front, see https://github.com/phetsims/vector-addition/issues/94
        this.moveToFront();

        // move the base vector to the front
        baseVectorNode.moveToFront();
      }
    } );
  }
}

vectorAddition.register( 'VectorSetNode', VectorSetNode );