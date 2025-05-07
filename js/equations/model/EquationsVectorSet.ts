// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsVectorSet is a specialization of VectorSet for the 'Equations' screen.  It adds:
 *
 *  - a predefined set of vectors; vectors cannot be added or removed
 *  - an EquationsSumVector
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsScene from './EquationsScene.js';
import EquationsSumVector from './EquationsSumVector.js';
import EquationsVector from './EquationsVector.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';

// Describes the initial vectors for Cartesian snap mode. See https://github.com/phetsims/vector-addition/issues/227
const CARTESIAN_VECTOR_DESCRIPTIONS = [

  // a
  {
    vectorComponents: new Vector2( 0, 5 ),
    vectorTail: new Vector2( 5, 5 ),
    baseVectorTail: new Vector2( 35, 15 )
  },

  // b
  {
    vectorComponents: new Vector2( 5, 5 ),
    vectorTail: new Vector2( 15, 5 ),
    baseVectorTail: new Vector2( 35, 5 )
  }
];

// Describes the initial vectors for polar snap mode. See https://github.com/phetsims/vector-addition/issues/227
const POLAR_VECTOR_DESCRIPTIONS = [

  // d
  {
    vectorComponents: Vector2.createPolar( 5, 0 ),
    vectorTail: new Vector2( 5, 5 ),
    baseVectorTail: new Vector2( 35, 15 )
  },

  // e
  {
    vectorComponents: Vector2.createPolar( 8, toRadians( 45 ) ),
    vectorTail: new Vector2( 15, 5 ),
    baseVectorTail: new Vector2( 35, 5 )
  }
];

export default class EquationsVectorSet extends VectorSet {

  public readonly symbolProperties: TReadOnlyProperty<string>[];

  // We need to know about EquationsVector instances, a specialization of Vector.
  // We can use a regular array (instead of ObservableArray) because the set of vectors is static in this screen.
  public readonly equationsVectors: EquationsVector[];

  /**
   * @param graph
   * @param componentVectorStyleProperty
   * @param sumVisibleProperty
   * @param vectorColorPalette - color palette for vectors in this set
   * @param coordinateSnapMode - each vector set can only represent one snap mode
   */
  public constructor( graph: EquationsScene,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sumVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette,
                      coordinateSnapMode: CoordinateSnapMode ) {

    const options = {

      // EquationsVectorSet will initialize its own sum vector, because the sum vector in this screen is different.
      // It's not truly a sum, and its computation depends on which equation type is selected (see EquationType).
      initializeSum: false,

      // offsets for sum component vectors in PROJECTION style
      sumProjectionXOffset: 0.5,
      sumProjectionYOffset: 0.5
    };

    super( graph, componentVectorStyleProperty, sumVisibleProperty, vectorColorPalette, options );

    this.symbolProperties = ( coordinateSnapMode === 'cartesian' ) ?
                            VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_1 :
                            VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_2;

    //----------------------------------------------------------------------------------------------------
    // Create the vectors, one less than symbols. For example, if symbols were [ 'a', 'b', 'c' ],
    // 'a' and 'c' would be vector symbols and 'c' would be the sum vector.

    const vectorDescriptions = ( coordinateSnapMode === 'cartesian' ) ?
                               CARTESIAN_VECTOR_DESCRIPTIONS :
                               POLAR_VECTOR_DESCRIPTIONS;
    assert && assert( vectorDescriptions.length === this.symbolProperties.length - 1 );

    this.equationsVectors = [];
    for ( let i = 0; i < vectorDescriptions.length; i++ ) {

      const vectorDescription = vectorDescriptions[ i ];

      // verify that all fields in the description are present
      assert && assert( vectorDescription.vectorTail, 'missing vectorTail' );
      assert && assert( vectorDescription.vectorComponents, 'missing vectorComponents' );
      assert && assert( vectorDescription.baseVectorTail, 'missing baseVectorTail' );

      const vector = new EquationsVector(
        vectorDescription.vectorTail,
        vectorDescription.vectorComponents,
        vectorDescription.baseVectorTail,
        graph,
        this,
        this.symbolProperties[ i ] );

      this.vectors.push( vector );
      this.equationsVectors.push( vector );
    }

    // Create the sum vector
    assert && assert( this.symbolProperties.length > 0 );
    this._sumVector = new EquationsSumVector( graph, this, graph.equationTypeProperty, _.last( this.symbolProperties )! );
    this._sumVector.setProjectionOffsets( options.sumProjectionXOffset, options.sumProjectionYOffset );
  }

  public override reset(): void {

    // We are not calling super.reset because the default behavior is to dispose of all vectors in this.vectors.
    // In the Equations screen, vectors are created automatically at startup, and there is no way to created them
    // via the UI.  So we want to keep them around, but reset them.
    // See https://github.com/phetsims/vector-addition/issues/143
    this.vectors.forEach( vector => { vector.reset(); } );

    // ... but we still need to reset the sum vector.
    this._sumVector && this._sumVector.reset();
  }
}

vectorAddition.register( 'EquationsVectorSet', EquationsVectorSet );