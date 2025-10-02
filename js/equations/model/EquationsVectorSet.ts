// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsVectorSet is a specialization of VectorSet for the 'Equations' screen.  It adds:
 *
 *  - a set of vectors that are permanently on the graph and not disposable
 *  - an EquationsSumVector
 *
 * @author Brandon Li
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet from '../../common/model/VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsScene from './EquationsScene.js';
import EquationsSumVector from './EquationsSumVector.js';
import EquationsVector from './EquationsVector.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';

type VectorDescription = {
  tandemNameSymbol: string; // symbol for the vector used in tandem names
  symbolProperty: TReadOnlyProperty<string>;
  xyComponents: Vector2;
  vectorTail: Vector2;
  baseVectorTail: Vector2;
};

// Describes the vectors for the Cartesian scene. See https://github.com/phetsims/vector-addition/issues/227
const CARTESIAN_VECTOR_DESCRIPTIONS: VectorDescription[] = [

  // a
  {
    tandemNameSymbol: 'a',
    symbolProperty: VectorAdditionSymbols.aStringProperty,
    xyComponents: new Vector2( 0, 5 ),
    vectorTail: new Vector2( 5, 5 ),
    baseVectorTail: new Vector2( 35, 15 )
  },

  // b
  {
    tandemNameSymbol: 'b',
    symbolProperty: VectorAdditionSymbols.bStringProperty,
    xyComponents: new Vector2( 5, 5 ),
    vectorTail: new Vector2( 15, 5 ),
    baseVectorTail: new Vector2( 35, 5 )
  }
];

// Describes the vectors for the polar scene. See https://github.com/phetsims/vector-addition/issues/227
const POLAR_VECTOR_DESCRIPTIONS: VectorDescription[] = [

  // d
  {
    tandemNameSymbol: 'd',
    symbolProperty: VectorAdditionSymbols.dStringProperty,
    xyComponents: Vector2.createPolar( 5, 0 ),
    vectorTail: new Vector2( 5, 5 ),
    baseVectorTail: new Vector2( 35, 15 )
  },

  // e
  {
    tandemNameSymbol: 'e',
    symbolProperty: VectorAdditionSymbols.eStringProperty,
    xyComponents: Vector2.createPolar( 8, toRadians( 45 ) ),
    vectorTail: new Vector2( 15, 5 ),
    baseVectorTail: new Vector2( 35, 5 )
  }
];

export default class EquationsVectorSet extends VectorSet {

  public readonly symbolProperties: TReadOnlyProperty<string>[];
  public readonly sumSymbolProperty: TReadOnlyProperty<string>;

  // We need to know about EquationsVector instances, a specialization of Vector.
  // We can use a regular array (instead of ObservableArray) because the set of vectors is static in this screen.
  public readonly equationsVectors: EquationsVector[];

  /**
   * @param scene
   * @param componentVectorStyleProperty
   * @param vectorColorPalette - color palette for vectors in this set
   * @param coordinateSnapMode - each vector set can only represent one snap mode
   * @param tandem
   */
  public constructor( scene: EquationsScene,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorColorPalette: VectorColorPalette,
                      coordinateSnapMode: CoordinateSnapMode,
                      tandem: Tandem ) {

    // Symbol for the sum vector used in tandem names.
    const sumTandemNameSymbol = ( coordinateSnapMode === 'cartesian' ) ? 'c' : 'f';

    const options = {

      // EquationsVectorSet will initialize its own sum vector, because the sum vector in this screen is different.
      // It's not truly a sum, and its computation depends on which equation type is selected (see EquationType).
      initializeSum: false,

      // offsets for sum component vectors in PROJECTION style
      sumProjectionXOffset: 0.5,
      sumProjectionYOffset: 0.5,

      sumTandemNameSymbol: sumTandemNameSymbol,
      tandem: tandem
    };

    super( scene, componentVectorStyleProperty, vectorColorPalette, options );

    this.symbolProperties = [];
    this.equationsVectors = [];

    // Create the individual vectors.
    const vectorDescriptions = ( coordinateSnapMode === 'cartesian' ) ? CARTESIAN_VECTOR_DESCRIPTIONS : POLAR_VECTOR_DESCRIPTIONS;
    for ( let i = 0; i < vectorDescriptions.length; i++ ) {

      const vectorDescription = vectorDescriptions[ i ];

      const vector = new EquationsVector(
        vectorDescription.vectorTail,
        vectorDescription.xyComponents,
        vectorDescription.baseVectorTail,
        scene,
        this,
        vectorDescription.symbolProperty,
        vectorDescription.tandemNameSymbol,
        options.tandem.createTandem( `${vectorDescription.tandemNameSymbol}Vector` ) );

      this.vectors.push( vector );
      this.symbolProperties.push( vectorDescription.symbolProperty );
      this.equationsVectors.push( vector );
    }

    const sumSymbolProperty = ( coordinateSnapMode === 'cartesian' ) ? VectorAdditionSymbols.cStringProperty : VectorAdditionSymbols.fStringProperty;
    this.sumSymbolProperty = sumSymbolProperty;
    this.symbolProperties.push( sumSymbolProperty );

    // Create the sum vector
    this._sumVector = new EquationsSumVector( scene, this, scene.equationTypeProperty, sumSymbolProperty, sumTandemNameSymbol, tandem.createTandem( `${sumTandemNameSymbol}Vector` ) );
    this._sumVector.setProjectionOffsets( options.sumProjectionXOffset, options.sumProjectionYOffset );
  }

  /**
   * We are not calling super.reset() because the default behavior is to dispose of all vectors in this.vectors.
   * In the Equations screen, vectors are created at startup, and there is no way to create them via the UI.
   * So we want to keep them around, but reset them. See https://github.com/phetsims/vector-addition/issues/143
   */
  public override reset(): void {
    this.vectors.forEach( vector => vector.reset() );
    this._sumVector && this._sumVector.reset();
    // Do not call super.reset -- see note above!
  }
}

vectorAddition.register( 'EquationsVectorSet', EquationsVectorSet );